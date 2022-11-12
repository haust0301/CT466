#Server setup:
cd server

npm install

cp .env.example .evn

Hiệu chỉnh file .evn

PORT=5000
MONGODB_CNN=mongodb+srv://b1909913:hau123iop@cluster.albpccr.mongodb.net/?retryWrites=true&w=majority

JWT_SECRET_KEY=RANDOMKEY

CLOUDINARY_URL=cloudinary://487472261249848:YNLSrgte5BTHKqoCUW_6Mf5ZSV0@haust0301

Client setup:

cd ..

cd client_vue

npm install

Deployment

cd ..

cd server_express

npm run dev

cd ..

cd client_vue

npm run serve
