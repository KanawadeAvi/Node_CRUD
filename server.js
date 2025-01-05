var express= require('express')
var app= express();
var mysql=require('mysql')
const util = require('util');
var url = require('url');

app.use(express.urlencoded({ extended: true })); //


var conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'employee',
    port:'3306'
})
conn.query = util.promisify(conn.query);

conn.connect((err)=>{
    console.log("Database connection is Sucessfully done");
})



app.get('/',(req,res)=>{
    res.render('home.ejs')
})

app.post('/submit', async (req, res) => {
    
   // res.send('data submitted')

  // create tbl

    // const sql = `CREATE TABLE products (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     name VARCHAR(100) NOT NULL,
    //     category VARCHAR(50) NOT NULL,
    //     price DECIMAL(10, 2) NOT NULL,
    //     stock INT NOT NULL,
    //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    // )`;

    // try {
    //     await conn.query(sql);
    //     res.send('Table create successfully');
    // } catch (error) {
    //     console.error(error);
    //     send(error);
    // }

// insert data

var sql = ` insert into products(name,category,price,stock) values('${req.body.name}','${req.body.category}','${req.body.price}','${req.body.stock}')`;
          await conn.query(sql);
         // res.send('data inserted sucessfully')
        res.redirect('/productInfo')
 });

/**************************************************************************************************** */
//  get data from database
app.get('/productInfo',async (req, res) => {
    var sql = `SELECT * FROM products`;
    const data = await conn.query(sql);
       res.render('productInfo.ejs', { data })
    });

/**************************************************************************************************** */
//delete data from database

// delete
app.get("/delete",async (req, res) => {
    // fetch emp id through url
    var urldata = url.parse(req.url, true).query;
    console.log(urldata);

    var id = urldata.id;
   
    var sql = `Delete from products where id=${id}`;
    await conn.query(sql);
   
    res.redirect('/productInfo');

})


/**************************************************************************************************** */
//edit data from database

// Edit User Route
app.get('/edit/:id', async (req, res) => {

    // get id  without url package
    var id = req.params.id;

    var sql = `select * from products where id=${id}`;
    
    const data = await conn.query(sql, [id]);
       
        res.render('editproduct.ejs',{ data: data[0] })


    })



// *****************************

// update emp data
app.post('/update_product',async (req, res) => {

    // res.send(req.body);
    var sql = `Update products set 
    name='${req.body.name}',
    category='${req.body.category}',
    stock='${req.body.stock}',
    price='${req.body.price}'

    where id='${req.body.id}' `
    
    await conn.query(sql);

        // res.send("Update Successfuly")

        res.redirect('/productInfo');
    })




var PORT=1000;
app.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})