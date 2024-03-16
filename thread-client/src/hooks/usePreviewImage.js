import React, { useState } from 'react'
import useShowtoast from './useShowToast';

function usePreviewImage() {
    const showToast = useShowtoast();
    const [imageUrl , setImageUrl] = useState(null);

    const handleImageChange = async(e)=>{
        const file = e.target.files[0];

        if(file && file.type.startsWith("image/")){
            const reader = new FileReader();

            reader.onloadend = ()=>{
                setImageUrl(reader.result);
            }

            reader.readAsDataURL(file);
        }
        else{
            showToast("Error" , "please select an image file" , "error");
            setImageUrl(null);
            return;
        }
    }
    return {handleImageChange , imageUrl , setImageUrl};
}

export default usePreviewImage
