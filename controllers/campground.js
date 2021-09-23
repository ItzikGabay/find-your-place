const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
    // on error-
    // if (!req.body.campground) throw new ExpressError('Invalid campground data', 400)

    // get GeoJSON Data from mapbox API
    const getData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    // For test purposes:
    // console.log(getData.body.features[0].geometry.coordinates);

    // Create new campground
    const campground = new Campground(req.body.campground)

    /**
     * geometry = geo location json API result.
     * images = images user uploaded.
     * author = id of user:
     */
    campground.geometry = getData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;

    console.log(campground);

    // success result
    await campground.save()
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!campground) {
        req.flash('error', 'Cannot find campground!')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}

module.exports.updateCampground = async (req, res) => {
    // Retrieve ID of current campground
    const { id } = req.params

    // Retrieve the campground
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })

    // Auth check
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }

    // getting info of image
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }))

    // push images to campground images array
    campground.images.push(...images)
    await campground.save()

    // remove images when updating
    if (req.body.deleteImages) {
        // loop each image checked and delete from cloudinary
        for (let filename of req.body.deleteImages) {
            cloudinary.uploader.destroy(filename)
        }
        // remove image from Database as well.
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }

    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfuly deleted campground')
    res.redirect('/campgrounds')
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find campground!')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}