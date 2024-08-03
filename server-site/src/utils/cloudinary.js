import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"



// Configuration
cloudinary.config({ 
    cloud_name: 'dh5j8xdcj', 
    api_key: '641492213197671', 
    api_secret: '1aST0Du4JzCwfHI5zUbrC5DmUpY' // Click 'View Credentials' below to copy your API secret
});

export const cloudinaryUpload = async (localPath, folder) => {
    try{
        const uploadResult = await cloudinary.uploader
        .upload(
                localPath, {
                resource_type: "auto",
                folder,
                use_filename:true,
                unique_filename: true
            }
        )
        fs.unlinkSync(localPath)
        return uploadResult
    
    } catch(error) {
      console.log("cloudinary", error.message )
    }
}

export const cloudinaryDelete =async (publicId) => {
   
    try {
        const deleteResult = await cloudinary.uploader.destroy(publicId, {
             invalidate: true
        })
        return deleteResult
    } catch (error) {
        console.log("cloudinary", error.message);
    }


}


{/*
    (async function() {
    
        
        // Upload an image
        const uploadResult = await cloudinary.uploader
        .upload(
            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
                public_id: 'shoes',
            }
        )
        .catch((error) => {
            console.log(error);
        });
     
     console.log(uploadResult);
        
        // Optimize delivery by resizing and applying auto-format and auto-quality
        const optimizeUrl = cloudinary.url('shoes', {
            fetch_format: 'auto',
            quality: 'auto'
        });
        
        console.log(optimizeUrl);
        
        // Transform the image: auto-crop to square aspect_ratio
        const autoCropUrl = cloudinary.url('shoes', {
            crop: 'auto',
            gravity: 'auto',
            width: 500,
            height: 500,
        });
        
        console.log(autoCropUrl);    
    })();
*/}