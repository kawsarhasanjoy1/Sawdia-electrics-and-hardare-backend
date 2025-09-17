// Now, also update your QueryBuilders class.
// The `filter` method needs to be adjusted to handle the `queryObj` passed from the service.

// QueryBuilders.ts

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
    // The query object is already prepared by the service, so just use it
    const queryObj = { ...this.query };
    if (queryObj?.isOnline) {
      queryObj.isOnline = Boolean(queryObj?.isOnline);
    }
    const excludedFields = ["searchTerm", "page", "sort", "limit"];
    excludedFields.forEach((field) => delete queryObj[field]);
    // Apply the prepared filters from the service
    console.log("queryObj", queryObj);
    this.QueryModel = this.QueryModel.find(queryObj);
    return this;
  }

  sort() {
    const sort = this.query.sort ? this.query.sort : "-createdAt";
    this.QueryModel = this.QueryModel.sort(sort);
    return this;
  }

  pagination() {
    const page = this.query.page ? Number(this.query.page) : 1;
    const limit = this.query.limit ? Number(this.query.limit) : 10;
    const skip = (page - 1) * limit;
    this.QueryModel = this.QueryModel.skip(skip).limit(limit);
    return this;
  }
}

export default QueryBuilders;
