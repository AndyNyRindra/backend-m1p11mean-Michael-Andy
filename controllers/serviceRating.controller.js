const db= require ('../models');

const ServiceRating = db.serviceRating;
const Service = db.service;
const User = db.user;

// get list of service rating by user id, get all service, and rating if there is, if not then 0
exports.getRatingByUserId = (req, res) => {
    const userId = req.params.id;
    if (userId==='undefined') {
        Service.find({}, (err, services) => {
            if (err) {
                return res.status(500).send({ message: err });
            }
            const servicesWithZeroRating = services.map(service => ({ ...service._doc, rating: 0 }));
            return res.status(200).send(servicesWithZeroRating);
        });
    }else {
        // find all services
        Service.find({}, (err, services) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }

            // Find ratings for the user
            ServiceRating.find({user: userId}, (err, ratings) => {
                if (err) {
                    res.status(500).send({message: err});
                    return;
                }

                // Create a map to store ratings by service ID
                const ratingsMap = new Map();
                ratings.forEach(rating => {
                    ratingsMap.set(rating.service.toString(), rating.rating);
                });

                // Loop through services to add ratings (or 0 if not found)
                const servicesWithRatings = services.map(service => {
                    const serviceId = service._id.toString();
                    const rating = ratingsMap.get(serviceId) || 0;
                    return {...service._doc, rating}; // Add rating to service document
                });

                // Return services with ratings
                return res.status(200).send(servicesWithRatings);
            });
        });
    }
}

exports.insertOrUpdateRating = (req, res) => {
    const userId = req.body.userId;
    const serviceId = req.body.serviceId;
    const rating = req.body.rating;

    // Define the filter for finding/updating the rating
    const filter = { user: userId, service: serviceId };

    // Define the update to be applied
    const update = { rating };

    // Set the `upsert` option to true to insert a new document if no match is found
    const options = { upsert: true, new: true };

    // Find and update (or insert) the rating
    ServiceRating.findOneAndUpdate(filter, update, options, (err, data) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        // Send the updated/inserted rating as the response
        return res.status(200).send(data);
    });
};
