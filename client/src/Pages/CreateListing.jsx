import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';

export default function CreateListing() {
    const [files,setFiles] = useState([]);
    const [formData,setFormData] = useState({
        imageUrls: [],
    });
    const [uploading,setUploading] = useState(false);
    const [imageUplaodError,setImageUploadError] = useState(null);
    console.log(formData);
    const handleImageTemplate = () =>{
        setUploading(true);
        setImageUploadError(false);
        const promises = [];
        if(files.length>0 && (files.length + formData.imageUrls.length)<7){
            for(let i=0;i<files.length;i++){
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then(url=>{
                setFormData({...formData,imageUrls: formData.imageUrls.concat(url)})
                setImageUploadError(false);
                setUploading(false);
            }).catch(error=>{
                setImageUploadError("Image upload failed (2MB max per image)");
                setUploading(false);
            })
        }else{
            setImageUploadError("Please upload only 6 images per listing")
            setUploading(false);
        }
    }
    const handleDeleteImage = (index) =>{
        setFormData({...formData,imageUrls:formData.imageUrls.filter((_,i)=> i!==index)})
    }
    const storeImage = async(file) =>{
        return new Promise((resolve,reject)=>{
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage,fileName);
            const uploadTask = uploadBytesResumable(storageRef,file);
            uploadTask.on(
                "state_changed",
                (snapshot)=>{
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress);
                },
                (error)=>{
                    setImageUploadError(true)
                    reject(error);
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downLoadURL)=>{
                        resolve(downLoadURL);
                    })
                }
            )

        })
    }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
      <form className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength={62} minLength={10} required/>
                <textarea type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' required/>
                <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' required/>
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="sale" className=''/>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="rent" className=''/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="parking" className=''/>
                        <span>Parking Spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="furnished" className=''/>
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="Offer" className=''/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex items-center gap-2'>
                        <input className='p-3 border border-gray-300 rounded-lg' type="number" id="bedrooms" min="1" max="10" required/>
                        <p>Beds</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input className='p-3 border border-gray-300 rounded-lg' type="number" id="bathrooms" min="1" max="10" required/>
                        <p>Baths</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input className='p-3 border border-gray-300 rounded-lg' type="number" id="regularPrice" required/>
                        <div className='flex flex-col items-center'>
                            <p>Regular Price</p>
                            <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input className='p-3 border border-gray-300 rounded-lg' type="number" id="discountedPRice" required/>
                        <div className='flex flex-col items-center'>
                            <p>Discounted Price</p>
                            <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
                <p className='semi-bold'>Images:
                <span className='font-normal text-gray-600 ml-2'>The first image will be cover(max 6)</span>    
                </p>
                <div className='flex gap-4'>
                    <input onChange={(e)=>setFiles(e.target.files)} className="p-3 border border-gray-300 rounded w-full" type='file' id="images" accepts='images/*' multiple/>
                    <button onClick={handleImageTemplate} disabled={uploading} type="button" className='p-3 text-green-700 border rounded border-green-700 uppercase hover:shadow-lg disabled:opacity-80 hover:bg-green-700 hover:text-white'>{uploading?'Uploading...':'Upload'}</button>
                </div>
                <p className='text-red-700 text-sm'>{imageUplaodError && imageUplaodError}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url,index)=>(
                        <div key={index} className='flex justify-between p-3 border items-center'>
                            <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg'/>
                            <button type='button' className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75' onClick={()=>handleDeleteImage(index)}>Delete</button>
                        </div>
                    ))
                }
            <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create List</button>
            </div> 
      </form>
    </main>
  )
}
