"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginatedResponse = exports.getPaginationParams = void 0;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const getPaginationParams = (query) => {
    const page = Math.max(1, Number(query.page) || DEFAULT_PAGE);
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(query.limit) || DEFAULT_LIMIT));
    const skip = (page - 1) * limit;
    return { page, limit, skip, take: limit }; // take is just limit, prisma uses "take"
};
exports.getPaginationParams = getPaginationParams;
const buildPaginatedResponse = (data, total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    };
};
exports.buildPaginatedResponse = buildPaginatedResponse;
//# sourceMappingURL=pagination.js.map