import React,{useEffect,useState} from 'react'
import { useParams } from 'react-router-dom'
//swiper imports
import {Swiper,SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'

function Listing() {
    SwiperCore.use([Navigation]);//initialize swiper navigation
    const params = useParams();
    const [listing,setListing] = useState(null);
    const {listingId} =  params;
    //loading and error for full page while fetcing data
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(false);
    useEffect(()=>{
        try {
            setLoading(true);
            setError(false)
            const fetchListing = async()=>{
                const data = await fetch(`/api/userListing/getListing/${listingId}`);
                const res = await data.json();
                if(res.success === false){
                    setError(true);
                    setLoading(false)
                    return
                }
                setListing(res);
                setError(false);
                setLoading(false)
                console.log(listing)
            }
            fetchListing();
        } catch (error) {
            setError(true)
            setLoading(false)
        }
    },[listingId])
  return (
    <main>
        {loading ? <p className='text-center my-7 text-2xl'>Loading...</p>:''}
        {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}
        {listing && !loading && !error && (
            <>
                <Swiper navigation>
                    {listing.imageUrls.map(url=>(
                        <SwiperSlide key={url}>
                            <div className='h-[550px]' style={{background:`url(${url}) center no-repeat`,
                    backgroundSize: 'cover'}}></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </>
        )}
    </main>
  )
}

export default Listing