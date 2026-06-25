import { Query, Document, Model } from "mongoose";

export interface PaginationResult<T> {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  data: T[];
}

export interface QueryString {
  page?: string | number;
  sort?: string;
  limit?: string | number;
  fields?: string;
  order?: string;
  [key: string]: any;
}

export class ApiFeatures<T extends Document> {
  private filterObj: Record<string, any> = {};
  private sortObj: string = "-createdAt";
  private skipVal: number = 0;
  private limitVal: number = 10;
  private selectedFields: string = "";

  constructor(private queryString: QueryString) {}

  //  Filter
  filter(): this {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "order"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const parsed: Record<string, any> = JSON.parse(queryStr);

    const enumFields = ["status", "role", "priority"];

    Object.keys(parsed).forEach((key) => {
      const value = parsed[key];
      if (typeof value === "object" && !Array.isArray(value)) {
        this.filterObj[key] = value;
      } else if (enumFields.includes(key)) {
        this.filterObj[key] = value;
      } else {
        this.filterObj[key] = { $regex: value, $options: "i" };
      }
    });

    return this;
  }

  //  Sort
  sort(): this {
    if (this.queryString.sort) {
      const direction =
        this.queryString.order?.toLowerCase() === "desc" ? "-" : "";
      this.sortObj = `${direction}${this.queryString.sort}`;
    } else {
      this.sortObj = "-createdAt";
    }
    return this;
  }

  //  Paginate
  paginate(): this {
    const page = Math.max(Number(this.queryString.page) || 1, 1);
    const limit = Math.min(
      Math.max(Number(this.queryString.limit) || 10, 1),
      100,
    );
    this.skipVal = (page - 1) * limit;
    this.limitVal = limit;
    return this;
  }

  //  Field Select
  selectFields(): this {
    if (this.queryString.fields) {
      this.selectedFields = this.queryString.fields.split(",").join(" ");
    }
    return this;
  }

  //  Execute
  async execute(model: Model<T>): Promise<PaginationResult<T>> {
    const [data, total] = await Promise.all([
      model
        .find(this.filterObj)
        .sort(this.sortObj)
        .skip(this.skipVal)
        .limit(this.limitVal)
        .select(this.selectedFields || "-__v"),

      model.countDocuments(this.filterObj),
    ]);

    const page = Math.floor(this.skipVal / this.limitVal) + 1;

    return {
      currentPage: page,
      totalPages: Math.ceil(total / this.limitVal),
      totalCount: total,
      hasNextPage: page < Math.ceil(total / this.limitVal),
      hasPrevPage: page > 1,
      data,
    };
  }
}
