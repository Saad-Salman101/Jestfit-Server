const httpStatus = require("http-status");
const { sportTypeService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");


const createSportType = catchAsync(async (req, res) => {
    const checkSportName = await sportTypeService.getSportTypeByName(req.body.name);
    if (checkSportName) {
        return res.status(httpStatus.BAD_REQUEST).send({ success: false, result: null, message: "Sport type already exists" });
    }
    const result = await sportTypeService.createSportType(req.body);
    res.status(httpStatus.CREATED).send({ success: true, message: "Successfully created sportType", result });
});

const querySportTypes = catchAsync(async (req, res) => {
    const filters = pick(req.query, ["name"]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const result = await sportTypeService.querySportType(filters, options)
    res.status(httpStatus.OK).send({ success: true, message: "Successfully fetched results", result })
})


const deleteSportType = catchAsync(async (req, res) => {
    const result = await sportTypeService.deleteSportTypeById(req.params.id);
    res.status(httpStatus.OK).send({ success: true, message: "Successfully deleted", result });
});

const getSportTypeById = catchAsync(async (req, res) => {
    const result = await sportTypeService.getSportTypeById(req.params.id);
    res.status(200).send({ success: true, message: "successfully fetched sportType", result });
});

const getAllSportType = catchAsync(async (req, res) => {
    const sportType = await sportTypeService.getAllSportTypes();
    res.status(200).send(sportType);
});

const updateSportType = catchAsync(async (req, res) => {
    const result = await sportTypeService.updateSportTypeById(req.params.id, req.body);
    res.status(200).send({ success: true, message: "Successfully Updated", result });
});

module.exports = {
    createSportType,
    deleteSportType,
    getSportTypeById,
    getAllSportType,
    querySportTypes,
    updateSportType,
};
