export default function connection(mongoose, uri) {
    function connectToMongo() {
        mongoose
            .connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(
                console.log('database connected successfully!')
            )
            .catch((err) => {
                console.error('ERROR:', err);
            });
    }

    return {
        connectToMongo
    };
}
