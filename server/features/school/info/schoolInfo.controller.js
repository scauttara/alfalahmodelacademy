import SchoolInfo from "./schoolInfo.model.js";

export const getSchoolInfo = async (req, res) => {
  try {
    const schoolInfo = await SchoolInfo.findOne();

    if (!schoolInfo) {
        return res.status(200).json(null);
    }

    res.json(schoolInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSchoolInfo = async (req, res) => {
    try {
        const existingInfo = await SchoolInfo.findOne();
        if (existingInfo) {
            return res.status(400).json({ message: "School Information already exists. Please update the existing one." });
        }

        const schoolInfo = new SchoolInfo(req.body);
        const savedInfo = await schoolInfo.save();
        res.status(201).json(savedInfo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateSchoolInfo = async (req, res) => {
    try {
        const schoolInfo = await SchoolInfo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!schoolInfo) return res.status(404).json({ message: "Not found" });
        res.json(schoolInfo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteSchoolInfo = async (req, res) => {
    try {
        const schoolInfo = await SchoolInfo.findByIdAndDelete(req.params.id);
        if (!schoolInfo) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};