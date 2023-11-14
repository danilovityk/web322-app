const Sequelize = require('sequelize');
var sequelize = new Sequelize('SenecaDB', 'danilovityk', '4Nrow0nclMzU', {
    host: 'ep-steep-base-90367442-pooler.us-east-1.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

const Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
});
  
const Category = sequelize.define('Category', {
    category: Sequelize.STRING
});

Post.belongsTo(Category, {foreignKey: 'category'});


async function initialize()
{
    return new Promise((resolve, reject) =>
    {
        sequelize.sync().then((data) =>
        {
            resolve(data);
        }).catch(err => reject('unable to sync the database'));
    });

}

async function getAllPosts()
{
    return new Promise((resolve, reject) => {
        Post.findAll().then(data =>
        {
           
            console.log(data)
            resolve(data)
        })
            .catch(err =>
            {
                reject('no results retuned')
            });
    });
}

async function getPublishedPostsByCategory(category)
{
    return new Promise((resolve, reject) =>
    {
        Post.findAll({
            where: {
                published: true,
                category: category
            }
        }).then(data =>
        {
            if (data.length > 0)
            {
                resolve(data)
            }
            reject('no results returned')
        }).catch(err => reject('no results returned'))
    });

}

async function getPublishedPosts()
{
    return new Promise((resolve, reject) =>
    {
        console.log('get posted all is called')
        Post.findAll({
            where: {
                published: true,
            }
        }).then(data =>
        {
            resolve(data)
        }).catch(err =>
        {
            reject('no results returned')
        })
    });

}

async function getCategories()
{
    return new Promise((resolve, reject) => {
        Category.findAll().then(data =>
        {
           resolve(data)
       }).catch(err => reject('no results returned'))
    });

}

async function addPost(postData)
{
    return new Promise((resolve, reject) => {
        postData.published = (postData.published) ? true : false;
        for (prop in postData)
        {
            if (prop == "")
            {
                prop = null;
            }
        }
        if (!postData.category)
        {
            postData.category = null
        }
        postData.postDate = new Date();
        
        Post.create({
            title: postData.title,
            body: postData.body,
            postDate: postData.postDate,
            featureImage: postData.featureImage,
            published: postData.published,
            category: postData.category
        }).then(resolve()).catch(err => reject('could not create an object'))
    });

}

async function getPostsByCategory(category)
{
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                category: category
        }}).then((data) =>
        {
           resolve(data)
        }).catch(err => reject('no results returned'));
    });

}

async function getPostsByMinDate(minDateStr)
{
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                postDate: { $gte: new Date(minDateStr) }
            }
        }).then(data =>
        {
            
        }).catch(err => reject('No results returned'))
    });

}

async function getPostById(id)
{
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
            id: id
        }}).then(data =>
        {
            resolve(data[0])     
        }).catch (err => reject('no results returned'))
    });

}

async function addCategory(categoryData){
    return new Promise((resolve, reject) => {
        for (prop in categoryData)
        {
            if (prop == "")
            {
                prop = null;
            }
        }
        
        Category.create({
           category: categoryData.category
        }).then(resolve()).catch(err => reject('could not create an category'))
    });
}

async function deleteCategoryById(id){
    return new Promise((resolve, reject) =>
    {
        Category.destroy({
            where: {
                id: id
            }
        }).then(() => resolve()).catch((err) => reject('could not delete the category'))
    });
}

async function deletePostById(id)
{
    return new Promise((resolve, reject) =>
    {
        Post.destroy({
            where: {
            id: id
        }}).then(() => resolve()).catch(() => reject('could not delete the post'))
    })
}

module.exports = { initialize, getAllPosts, getPublishedPosts, getCategories, addPost, getPostsByCategory, getPostsByMinDate, getPostById, getPublishedPostsByCategory, addCategory, deleteCategoryById, deletePostById};
