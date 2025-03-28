const router = require('express').Router()


const { index, show, create, likeUpdate, upload } = require('../controller/propertiesController')
const { logIn, registration } = require('../controller/usersController')
const { reviewsShow, reviewCreate } = require('../controller/reviewsController')
const { sendMessage } = require('../controller/messagesController')
const { searchUrl } = require('../controller/searchController')

router.get('/properties', index)
router.get('/properties/:slug', show)



router.post('/properties/:owner', create)  //search field named "image"


router.put('/like/:slug', likeUpdate)

router.post('/user/logIn', logIn)
router.post('/user/registration', registration)

router.post('/message/send', sendMessage)

router.get('/properties/:slug/reviews', reviewsShow)
router.post('/:slug/:name/add-review', reviewCreate)

router.get('/search', searchUrl)

module.exports = router