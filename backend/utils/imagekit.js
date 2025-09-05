import ImageKit from "imagekit";
import dotenv from "dotenv";
dotenv.config({quiet: true});

const imageKitKey = new ImageKit({
    publicKey : process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey : process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGE_KIT_URL_END_POINT
});

export default imageKitKey;