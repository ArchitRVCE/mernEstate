import React from 'react'

export default function CreateListing() {
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
                    <input className="p-3 border border-gray-300 rounded w-full" type='file' id="images" accepts='images/*' multiple/>
                    <button className='p-3 text-green-700 border rounded border-green-700 uppercase hover:shadow-lg disabled:opacity-80'>Upload</button>
                </div>
            <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create List</button>
            </div> 
      </form>
    </main>
  )
}
