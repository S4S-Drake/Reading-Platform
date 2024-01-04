const { MongoClient , ServerApiVersion } = require('./Reading-Platform/infra/node_modules/mongodb/mongodb');
const mongoUri = "mongodb+srv://db_test:2023testmongo@cluster0.6cntudk.mongodb.net/?retryWrites=true&w=majority";


const axios = require('./Reading-Platform/infra/node_modules/axios');
const apiKey = 'AIzaSyB__en_CwigJYOR8RujAkOUgzBS56GD44w';

const bookName = 'Eragon';
const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(bookName)}&key=${apiKey}`;

const main = async () => {
    try {
        const response = await axios.get(searchUrl);
        const books = response.data.items;
        const firstBook = books[0].volumeInfo; // Assuming this is the first book in the response
        // console.log( Object.keys(firstBook) )

        const client = new MongoClient(mongoUri, {
            serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
            }
          });
        await client.connect();
        const db = client.db('ReadingApp');
        const booksCollection = db.collection('Books');
        const authorsCollection = db.collection('Authors');

      
        const bookDoc = {
            source : 'Google',
            source_id : books[0].id,
            title: firstBook.title,
            author : firstBook.authors,
            genre : firstBook.categories,
            number_pages : firstBook.pageCount || null ,
            year_published : firstBook.publishedDate || null,
        };

        for (const AuthorName of firstBook.authors) {
            const authorDoc = {
                name: AuthorName,
                books: [firstBook.title]
            }
            const result = await booksCollection.insertOne(authorDoc);
            console.log(`An author document was inserted with the _id: ${result.insertedId}`);
        }

        const result = await booksCollection.insertOne(bookDoc);
        console.log(`A book document was inserted with the _id: ${result.insertedId}`);
        await client.close();
    }
    catch(error) {
        console.error('Error:', error);
    }
};

main();





// axios.get(searchUrl)
//   .then(response => {
//     // Print the response data
//     const books = response.data.items;
//     const firstBook = books[0].volumeInfo;

//     // Dictionary of the data we want to save from the response
//     const bookDoc = {
//         source : 'Google',
//         source_id : books[0].id,
//         title: firstBook.title,
//         author : firstBook.authors,
//         genre : firstBook.categories,
//         number_pages : firstBook.pageCount || null ,
//         year_published : firstBook.publishedDate || null,
//     }
//     // console.log(response.data);
//     console.log(bookDoc);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
