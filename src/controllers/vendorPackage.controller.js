const httpStatus = require("http-status");
const { vendorPackageService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");




const createVendorPackage = catchAsync(async (req, res) => {
    const result = await vendorPackageService.createVendorPackage(req.body);
    res.status(httpStatus.CREATED).send({ success: true, message: "Successfully created vendorPackage", result });
});

const queryVendorPackage = catchAsync(async (req, res) => {
    const filters = pick(req.query, ["email", "number", "vendorPackageType"]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const result = await vendorPackageService.queryVendorPackage(filters, options)
    res.status(httpStatus.OK).send({ success: true, message: "Successfully fetched results", result })
})


const deleteVendorPackage = catchAsync(async (req, res) => {
    const result = await vendorPackageService.deleteVendorPackageById(req.params.id);
    res.status(httpStatus.OK).send({ success: true, message: "Successfully deleted", result: result });
});

const getVendorPackage = catchAsync(async (req, res) => {
    const result = await vendorPackageService.getVendorPackageById(req.params.id);
    res.status(httpStatus.OK).send({ success: true, message: "successfully fetched vendorPackage", result });
});

const updateVendorPackage = catchAsync(async (req, res) => {
    const result = await vendorPackageService.updateVendorPackageById(req.params.id, req.body);
    res.status(httpStatus.OK).send({ success: true, message: "Successfully Updated", result });
});

module.exports = {
    createVendorPackage,
    deleteVendorPackage,
    getVendorPackage,
    queryVendorPackage,
    updateVendorPackage,
};
