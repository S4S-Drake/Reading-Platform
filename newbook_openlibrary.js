const { MongoClient , ServerApiVersion } = require('./Reading-Platform/infra/node_modules/mongodb/mongodb');
const mongoUri = "mongodb+srv://db_test:2023testmongo@cluster0.6cntudk.mongodb.net/?retryWrites=true&w=majority";

const axios = require('./Reading-Platform/infra/node_modules/axios'); 
const bookName = 'The Lord of the Rings';
const bookQuery = bookName.replace(/\s/g, '+');
const searchUrl = 'https://openlibrary.org/search.json?q='+bookQuery;


const main = async () => {
    try {
        const response = await axios.get(searchUrl);
        const firstBook = response.data.docs[0]; // Assuming this is the first book in the response
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
          source : 'Open Library',
        source_id : firstBook.key,
          title: firstBook.title + 'test',
          author: firstBook.author_name,
          genre: firstBook.subject,
          number_pages : firstBook.number_of_pages_median,
          year_published: firstBook.first_publish_year,
        };

        for (const AuthorName of firstBook.author_name) { 
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
    } catch(error) {
    console.error('Error:', error);
  }
};

main();



