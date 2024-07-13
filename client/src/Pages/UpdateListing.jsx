import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState,useEffect } from 'react'
import { app } from '../firebase';
import {useSelector} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'

function UpdateListing() {
    const [files,setFiles] = useState([]);
    const {currentUser} = useSelector(state=>state.user);
    const navigate = useNavigate();
    const params = useParams()
    const [formData,setFormData] = useState({
        name: '',
        description:'',
        address:'',
        type:'rent',
        bedrooms:1,
        bathrooms:1,
        regularPrice:50,
        discountPrice:0,
        offer:false,
        parking:false,
        furnished:false,
        imageUrls: [],
    });
    
    useEffect(()=>{
        const fetchListing = async() =>{
           const {listingId} = params;
           const data = await fetch(`/api/userListing/getListing/${listingId}`);
           const res = await data.json();
           if(res.success === false){
            console.log(res.message)
            return
           }
           setFormData(res);
        }
        fetchListing();
    },[])


    const [uploading,setUploading] = useState(false);
    const [imageUplaodError,setImageUploadError] = useState(null);
    const [error,setErrors] = useState(false);
    const [loading,setLoading] =  useState(false);
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
                setLoading(false);
                setErrors(false);
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
    const handleChange = (e) =>{
        if(e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({...formData,type:e.target.id});
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setFormData({...formData,[e.target.id]:e.target.checked})
        }
        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
            setFormData({...formData,[e.target.id]:e.target.value});
        }
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
    const handleFormSubmit = async(e) =>{
        e.preventDefault();
        try {
            
            setErrors(false);
            setLoading(true);
            if(+formData.regularPrice < +formData.discountPrice) return setErrors('Discount price must be lower than regular price!')
            const res = await fetch(`/api/userListing/update/${params.listingId}`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({...formData,userRef:currentUser._id}),
            });
            const data = await res.json();
            setLoading(false);
            if(data.success === false){
                setErrors(data.message);
            }
            navigate(`/listing/${data._id}`)
        } catch (error) {
            setErrors(error.message)
            setLoading(false);
        }
    }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
    <h1 className='text-3xl font-semibold text-center my-7'>Update Listing</h1>
    <form onSubmit={handleFormSubmit} className='flex flex-col sm:flex-row gap-4'>
          <div className='flex flex-col gap-4 flex-1'>
              <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength={62} minLength={10} required onChange={handleChange} value={formData.name}/>
              <textarea type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' required onChange={handleChange} value={formData.description}/>
              <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' required onChange={handleChange} value={formData.address}/>
              <div className='flex gap-6 flex-wrap'>
                  <div className='flex gap-2'>
                      <input type="checkbox" id="sale" className='' onChange={handleChange} checked={formData.type === 'sale'}/>
                      <span>Sell</span>
                  </div>
                  <div className='flex gap-2'>
                      <input type="checkbox" id="rent" className='' onChange={handleChange} checked={formData.type === 'rent'}/>
                      <span>Rent</span>
                  </div>
                  <div className='flex gap-2'>
                      <input type="checkbox" id="parking" className='' onChange={handleChange} checked={formData.parking}/>
                      <span>Parking Spot</span>
                  </div>
                  <div className='flex gap-2'>
                      <input type="checkbox" id="furnished" className=''onChange={handleChange} checked={formData.furnished}/>
                      <span>Furnished</span>
                  </div>
                  <div className='flex gap-2'>
                      <input type="checkbox" id="offer" className='' onChange={handleChange} checked={formData.offer}/>
                      <span>Offer</span>
                  </div>
              </div>
              <div className='flex gap-6 flex-wrap'>
                  <div className='flex items-center gap-2'>
                      <input className='p-3 border border-gray-300 rounded-lg' type="number" id="bedrooms" min="1" max="10" required onChange={handleChange} value={formData.bedrooms}/>
                      <p>Beds</p>
                  </div>
                  <div className='flex items-center gap-2'>
                      <input className='p-3 border border-gray-300 rounded-lg' type="number" id="bathrooms" min="1" max="10" required onChange={handleChange} value={formData.bathrooms}/>
                      <p>Baths</p>
                  </div>
                  <div className='flex items-center gap-2'>
                      <input className='p-3 border border-gray-300 rounded-lg' type="number" id="regularPrice" required onChange={handleChange} value={formData.regularPrice} min={50} max={1000000}/>
                      <div className='flex flex-col items-center'>
                          <p>Regular Price</p>
                          <span className='text-xs'>($ / month)</span>
                      </div>
                  </div>
                  {
                      formData.offer && (
                          <div className='flex items-center gap-2'>
                              <input className='p-3 border border-gray-300 rounded-lg' type="number" id="discountPrice" required onChange={handleChange} value={formData.discountPrice} min={0} max={1000000}/>
                              <div className='flex flex-col items-center'>
                                  <p>Discounted Price</p>
                                  <span className='text-xs'>($ / month)</span>
                              </div>
                          </div>
                      )
                  }
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
          <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading?'Updating...':'Update Listing'}</button>
          {error && (<p className='text-red-700 text-sm'>{error}</p>)}
          </div> 
    </form>
  </main>
  )
}

export default UpdateListing