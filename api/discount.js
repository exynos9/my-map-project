const axios = require('axios');

module.exports = async function (req, res) {
    try {
        const response = await axios.get('https://raw.githubusercontent.com/swswsw0518/amrt-discount/main/data-crawler/all_convenience_events.json', {
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3.raw'
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
