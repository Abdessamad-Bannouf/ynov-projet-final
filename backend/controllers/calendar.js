const {google} = require("googleapis");
const { v4: uuidv4 } = require('uuid');

const scopes = ['https://www.googleapis.com/auth/calendar'];

const oauth2Client = new google.auth.OAuth2
(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

//TODO: Supprimer la variable globalToken lorsque l'app sera en prod et/ou au moment où React sera mis en place et appelera ces routes
let globalTokens = null;

// login
exports.login = async (req, res, next) => {
    const url = oauth2Client.generateAuthUrl
    ({
        access_type: 'offline',
        scope: scopes
    });
    res.redirect(url);
};

// redirect login
exports.loginRedirect = async (req, res, next) => {
    const { tokens } = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);
    req.session.tokens = tokens; // stocker dans session
    req.session.tokens = tokens;
    globalTokens = tokens;
    res.send('Authentication successful! You can now create events.');
};

// create event with Google calendar
exports.create = async (req, res, next) => {
    // TODO: Décommenter les 2 lignes d'en dessous lorsque l'app sera en prod et/ou au moment où React sera mis en place et appelera ces routes
    //if (!req.session.tokens) return res.status(401).send("Not authenticated");
    if (!globalTokens) return res.status(401).send("Not authenticated");
        oauth2Client.setCredentials(globalTokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const {
        summary,
        description,
        start,
        end,
        attendees
    } = req.body;

    const event = {
        summary,
        location: 'Google Meet',
        description,
        start: {
            dateTime: start,
            timeZone: 'Europe/Paris',
        },
        end: {
            dateTime: end,
            timeZone: 'Europe/Paris',
        },
        conferenceData: {
            createRequest: {
                requestId: uuidv4(),
            },
        },
        attendees: attendees.map(email => ({ email })),
    };

    try {
        const result = await calendar.events.insert({
            calendarId: 'primary',
            conferenceDataVersion: 1,
            resource: event,
        });
        console.log(result.data.id);

        res.send({
            status: 200,
            message: 'Event created',
            hangoutLink: result.data.hangoutLink,
            eventHtmlLink: result.data.htmlLink,
        });
    } catch (error) {
        console.error('Erreur création événement :', error);
        res.status(500).send('Erreur lors de la création de l’événement');
    }
};

exports.update = async (req, res) => {
    // TODO: Décommenter les 2 lignes d'en dessous lorsque l'app sera en prod et/ou au moment où React sera mis en place et appelera ces routes
    //if (!req.session.tokens) return res.status(401).send("Not authenticated");
    // oauth2Client.setCredentials(req.session.tokens);

    if (!globalTokens) return res.status(401).send("Not authenticated");
        oauth2Client.setCredentials(globalTokens);

    const { v4: uuidv4 } = require('uuid');
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
        summary: 'evènement modifié avec succès',
        location: 'Google Meet',
        description: "evènement modifié avec succès.",
        start: {
            dateTime: "2025-07-15T19:30:00+05:30",
            timeZone: 'Europe/Paris',
        },
        end: {
            dateTime: "2025-07-15T19:30:00+05:30",
            timeZone: 'Europe/Paris',
        },
        colorId: 1,
        conferenceData: {
            createRequest: {
                requestId: uuidv4(),


            },
        },
        attendees: [
            { email: 'bannoufabdessamad@gmail.com' },
        ],
    };

    try {
        const result = await calendar.events.update({
            calendarId: 'primary',
            eventId: 'o2pvbjlgjiegd5q3fanrtrohkg',
            conferenceDataVersion: 1,
            resource: event,
            //sendUpdates: 'all',
        });

        res.send({
            status: 200,
            message: 'Event updated',
            link: result.data.hangoutLink,
        });
    } catch (error) {
        console.error('Erreur lors de la modification de l’événement :', error);
        res.status(500).send('Erreur lors de la modification de l’événement');
    }
};

exports.delete = async (req, res) => {
    // TODO: Décommenter les 2 lignes d'en dessous lorsque l'app sera en prod et/ou au moment où React sera mis en place et appelera ces routes
    //if (!req.session.tokens) return res.status(401).send("Not authenticated");
    // oauth2Client.setCredentials(req.session.tokens);

    if (!globalTokens) return res.status(401).send("Not authenticated");
        oauth2Client.setCredentials(globalTokens);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const eventId = req.body.eventId; // ou req.params.eventId selon ton routing

    if (!eventId) {
        return res.status(400).send("Event ID is required");
    }

    try {
        await calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId,
        });

        res.send({
            status: 200,
            message: `Event ${eventId} deleted successfully`,
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de l’événement :', error);
        res.status(500).send('Erreur lors de la suppression de l’événement');
    }
};
