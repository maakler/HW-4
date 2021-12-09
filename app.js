const express = require('express');
const pool = require('./database');
const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.listen(3000, () => {
 console.log("Server is listening to port 3000")
});

app.get('/', (req, res) => {
    res.render('index.ejs', {
        title: 'Home',
        nav: ['','posts','contactus'],
        footer: '© WAD 2021 '
  });
   });

// app.get('/posts', (req, res) => {
    
//     let posts = [
//         { "title": "test",
//         "body": "teest" },
//         { "title": "mineee",
//         "body": "perse" },
//         ];
    
//     res.render('posts', { posts: posts,
//         nav: ['','posts','contactus'],
//         footer: '© WAD 2021 '});
//    });

app.get('/contactus', (req, res) => {
    res.render('contactus', {
        title: 'About Us',
        nav: ['','posts','contactus'],
        footer: '© WAD 2021 '
    });
   });

// app.get('/posts', async(req, res) => {
//     try {
//     console.log("get posts request has arrived");
//     const postes = await pool.query(
//     "SELECT * FROM nodetable"
//     );
//     let posts = postes.rows
//     res.render('posts', { posts: posts,
//         nav: ['','posts','contactus'],
//         footer: '© WAD 2021 '});
//     } catch (err) {
//     console.error(err.message);
//     }
//    });
app.get('/posts', async(req, res) => {
    try {
    console.log("get posts request has arrived");
    const posts = await pool.query(
    "SELECT * FROM nodetable"
    );
    res.json(posts.rows);
    } catch (err) {
    console.error(err.message);
    }
   });

   app.get('/posts/:id', async(req, res) => {
    try {
    console.log("get a post request has arrived");
    const { id } = req.params;
    const posts = await pool.query(
    "SELECT * FROM nodetable WHERE id = $1", [id]
    );
    res.json(posts.rows[0]);
    } catch (err) {
    console.error(err.message);
    }
   });
   app.post('/posts/', async(req, res) => {
    try {
    console.log("a post request has arrived");
    const post = req.body;
    const newpost = await pool.query(
    "INSERT INTO nodetable(title, body, urllink) values ($1, $2, $3)RETURNING*", [post.title, post.body, post.urllink]
    );
    res.json( newpost );
    } catch (err) {
    console.error(err.message);
    }
   });
   app.put('/posts/:id', async(req, res) => {
    try {
    const { id } = req.params;
    const post = req.body;
    console.log("update request has arrived");
    const updatepost = await pool.query(
    "UPDATE nodetable SET (title, body, urllink) = ($2, $3, $4) WHERE id =$1", [id, post.title, post.body, post.urllink]
    );
    res.json(post);
    } catch (err) {
    console.error(err.message);
    }
   });
   app.delete('/posts/:id', async(req, res) => {
    try {
    const { id } = req.params;
    const post = req.body;
    console.log("delete a post request has arrived");
    const deletepost = await pool.query( "DELETE FROM nodetable WHERE id = $1", [id]
    );
    res.json(post);
    } catch (err) {
    console.error(err.message);
    }
   });
   
   


   app.use((req, res) => {
    res.status(404).render('404', {
       title: '404',
       nav: ['','posts','contactus'],
       footer: '© WAD 2021 '
       });
   });