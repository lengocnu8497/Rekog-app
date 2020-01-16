const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.set('port', process.env.PORT || 3000)
app.set('view engine','ejs')

var aws = require('aws-sdk')

app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
     extended: true
    })
);

aws.config.update({
    accessKeyId: 'YOUR_KEY_HERE',
    secretAccessKey: 'YOUR_KEY_HERE',
    region: 'us-east-2'
})

var rekog = new aws.Rekognition({})


app.get('/', function (req, res){
    res.render('index');
})

app.post('/', function (req, res) {

    var filename = req.body.filename;
    // pick image in S3 Bucket
    var params = {
        Image: {
            S3Object: {
                Bucket: "nu-rekog-image",
                Name: filename,
            }

        },
        MaxLabels: 5,
        MinConfidence: 80
    };
    

    // detect labels from image
    rekog.detectLabels(params, function(err,data) {
        if(err) {
            res.render('index.ejs', {result: err} )
        }
        else {
            let labelsText = ''
            for( i = 0;i < data.Labels.length; i++) {
                labelsText += data.Labels[i].Name + ' - Confidence ' + data.Labels[i].Confidence.toFixed(2) + '\r\n'
            }
            res.render('index.ejs', {result: labelsText} ) 
        }     
    });
    
})


app.listen(app.get('port'),function () {
    console.log('nah')
})
// app.listen(8081,function () {
//     console.log('nah')
// })