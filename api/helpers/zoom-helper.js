const axios = require('axios').default;
const jwt = require('jsonwebtoken');

const API_KEY = process.env.ZOOM_API_KEY || require('../../config.json').ZOOM.API_KEY;
const SECRET = process.env.ZOOM_SECRET || require('../../config.json').ZOOM.SECRET;

module.exports.generateMeeting = async (topic, start_time) => {
    const meetingPromise = new Promise((resolve, reject) => {

        const token = jwt.sign(
            { iss: API_KEY, exp: new Date().getTime() + 5000 },
            SECRET,
            { algorithm: 'HS256' }
        );

        const meetingDetails = {
            topic,
            type: 2,
            start_time,
            duration: '60',
            timezone: 'America/Chicago',
            agenda: 'test',
            recurrence: {
                type: 1,
                repeat_interval: 1
            },
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: false,
                mute_upon_entry: false,
                watermark: true,
                audio: 'voip',
                auto_recording: 'cloud'
            }
        };

        axios.post('https://api.zoom.us/v2/users/me/meetings', meetingDetails, { headers: { Authorization: `Bearer ${token}`, "Content-Type": 'application/json' } })
            .then(response => {
                let meeting = {
                    url: response.data.join_url,
                    zoomId: response.data.id,
                    password: response.data.password,
                    start_time: response.data.start_time
                };
                resolve(meeting);
            })
            .catch(err => {
                console.log(err);
                reject('Failed to create Zoom meeting.');
            });
    });
    return meetingPromise;
}