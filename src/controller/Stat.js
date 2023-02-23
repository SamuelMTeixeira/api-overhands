// Models
const Stat = require('../models/Stat')

module.exports = {
    async store(req, res) {
        const { reports } = req.body

        if (!reports) {
            return res.status(403).json({ error: 'Report is missing' })
        }

        try {
            for (const report of reports) {
                const stat = await Stat.create(report)
                if (!stat) {
                    return res.status(400).json({ error: 'Error to create report' })
                }
            }

            return res.json({ status: 'Reports successfully delivered' })
        } catch (err) {
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
}