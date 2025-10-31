import { Query } from "mongoose";

class QueryBuilders<T> {
  public QueryModel: Query<T[], T>;
  public query: Record<string, any>;

  constructor(QueryModel: Query<T[], T>, query: Record<string, any>) {
    this.QueryModel = QueryModel;
    this.query = query;
  }

  search(searchAbleFields: string[]) {
    if (this.query.searchTerm) {
      this.QueryModel = this.QueryModel.find({
        $or: searchAbleFields.map((field) => ({
          [field]: { $regex: this.query.searchTerm, $options: "i" },
        })),
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };

    let variants: Record<string, any> = {};
    if (queryObj?.variants) {
      try {
        variants = typeof queryObj.variants === "string"
          ? JSON.parse(queryObj.variants)
          : queryObj.variants;
      } catch {
        variants = {};
      }
      delete queryObj.variants;
    }


    const excludedFields = ["searchTerm", "page", "sort", "limit"];
    excludedFields.forEach((field) => delete queryObj[field]);

    const finalFilter: Record<string, any> = { ...queryObj };

    Object.entries(variants).forEach(([key, value]) => {
      const path = `variants.${key}`;
      if (Array.isArray(value)) {
        finalFilter[path] = {
          $in: value.map((v) =>
            (String(v)))
        };
      } else {
        finalFilter[path] = { $regex: value };
      }
    });


    this.QueryModel = this.QueryModel.find(finalFilter);
    return this;
  }


  sort() {
    const sort = this.query.sort ? this.query.sort : "-createdAt";
    this.QueryModel = this.QueryModel.sort(sort);
    return this;
  }

  pagination() {
    const page = this.query.page ? Number(this.query.page) : 1;
    const limit = Number(this.query.limit);
    const skip = (page - 1) * limit;
    this.QueryModel = this.QueryModel.skip(skip).limit(limit);
    return this;
  }

  async countTotal() {
    const totalQueries = this.QueryModel.getFilter();
    const total = await this.QueryModel.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit);
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilders;
