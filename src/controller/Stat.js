// Models
const Stat = require('../models/Stat')

module.exports = {
    async store(req, res) {
        // Receive all report activities
        const { reports } = req.body

        if (!reports) {
            return await res.status(400).json({ error: 'Report is missing' })
        }

        reports.forEach(async (report) => {
            const stat = await Stat.create(report)

            if(!stat) {
                return await res.status(500).json({ error: 'Error to create report' })
            }
        })

        return await res.json({ status: 'Report successfully delivered' })
    }
}