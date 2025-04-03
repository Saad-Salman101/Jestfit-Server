/* eslint-disable no-param-reassign */

const groupByPaginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination, group by, and populate features
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @param {string} [options.groupBy] - Field to group by
   * @param {Array<Object>} [extras] - Populate options
   * @returns {Promise<QueryResult>}
   */
  schema.statics.paginate = async function (filter, options, extras = null) {
    let sort = "";
    if (options.sortBy) {
      const sortingCriteria = [];
      options.sortBy.split(",").forEach((sortOption) => {
        const [key, order] = sortOption.split(":");
        sortingCriteria.push((order === "desc" ? "-" : "") + key);
      });
      sort = sortingCriteria.join(" ");
    } else {
      sort = "createdAt";
    }

    const limit =
      options.limit && parseInt(options.limit, 10) > 0
        ? parseInt(options.limit, 10)
        : 10;
    const page =
      options.page && parseInt(options.page, 10) > 0
        ? parseInt(options.page, 10)
        : 1;
    const skip = (page - 1) * limit;

    let aggregationPipeline = [];

    if (options.groupBy) {
      aggregationPipeline.push({
        $group: {
          _id: `$${options.groupBy}`,
          count: { $sum: 1 },
          docs: { $push: "$$ROOT" },
        },
      });
      aggregationPipeline.push({ $unwind: "$docs" }); // Unwind to flatten the grouped docs
      aggregationPipeline.push({ $replaceRoot: { newRoot: "$docs" } }); // Replace root with original doc structure
    }

    aggregationPipeline.push({ $match: filter });
    aggregationPipeline.push({ $sort: sort ? { [sort.replace(/^-/, "")]: sort.startsWith("-") ? -1 : 1 } : {} });
    aggregationPipeline.push({ $skip: skip });
    aggregationPipeline.push({ $limit: limit });

    // Convert _id to id in the results without removing _id
    aggregationPipeline.push({
      $addFields: {
        id: "$_id"
      }
    });

    // Add populate stages if extras is provided
    if (extras) {
      extras.forEach((pop) => {
        aggregationPipeline.push({
          $lookup: {
            from: pop.model.collection.name,
            localField: pop.localField,
            foreignField: pop.foreignField,
            as: pop.as,
          },
        });

        // Optionally unwind the populated field if it's not an array
        if (pop.single) {
          aggregationPipeline.push({
            $unwind: {
              path: `$${pop.as}`,
              preserveNullAndEmptyArrays: true, // Preserve documents even if the field is not populated
            },
          });
        }
      });
    }

    const countPipeline = [...aggregationPipeline];
    countPipeline.push({ $count: "totalResults" });

    const countPromise = this.aggregate(countPipeline).exec();
    const docsPromise = this.aggregate(aggregationPipeline).exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const totalResults = values[0][0] ? values[0][0].totalResults : 0;
      const results = values[1];
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = groupByPaginate;
