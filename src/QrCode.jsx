import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import './qrcode.css'
import 'react-toastify/dist/ReactToastify.css'


const QrCode = () => {
    const [img,setImg]=useState("");
    const[loading,setLoading]=useState(false);
    const[qrData,setqrData]= useState("");
    const[qrSize,setqrSize]=useState("");

    async function generateQR(){
        if (!qrData.trim()) {
            toast.warning("Please enter the QR data (location)");
            return;
        }

        const isValidMapUrl = /^(https:\/\/)?(maps\.app\.goo\.gl|www\.google\.[a-z.]+\/maps)/i.test(qrData);
        if (!isValidMapUrl) {
            toast.warning("Please enter a valid Google Maps URL.");
            return;
        }

        const size = parseInt(qrSize);

        if (isNaN(size) || size < 50 || size > 1000) {
            toast.warning("Please enter a valid image size between 50 and 1000");
            return;
        }

        setLoading(true);
        try{
            const url=`https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(qrData)}`;
            setImg(url);
            toast.success("QR Code generated!");
        }
        catch(error){
            console.error("Error generating QR code",error);
            toast.error("Failed to generate QR Code.");
        }
        finally{
            setLoading(false);
        }
    }
    function downloadQR(){
        if (!img){ 
            toast.warning("Please click generate QR code before downloading!");
            return;
        }
        fetch(img).then((response)=>response.blob()).then((blob)=>{
            const link=document.createElement("a");
            link.href=URL.createObjectURL(blob);
            link.download="qrcode.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("QR Code downloaded!");
        }).catch((error) => {
                console.error("Download failed", error);
                toast.error("Download failed.");
            });
        ;
    }
  return (
    <div className="app-container">
        <h1 className="title-with-logo"> <img src="/logo.png" alt="Logo" className="logo" />QR CODE GENERATOR</h1>
        <ToastContainer position="top-right" autoClose={3000} />
        {loading && <p> Please wait...</p>}
        {img && <img src={img} alt="QR" className='qrimage'/>}
        <div>
            <label htmlFor='dataInput' className='input-label'>
                Location:
            </label>
            <input type="text" value={qrData}id='dataInput' placeholder='Enter your gmaplocation' onChange={(event)=>setqrData(event.target.value)}></input>
            <label htmlFor='sizeInput' className='input-label'>
                Size:
            </label>
            <input type='number' min="50"max="1000" id='sizeInput' placeholder='Enter Image Size' value={qrSize} onChange={(event)=>setqrSize(event.target.value)}></input>
            <button className='generate' disabled={loading} onClick={generateQR}>Generate QR</button>
            <button className='download' onClick={downloadQR} >Download QR</button>
        </div>
        <p className='footer'>Designed by Lalitha</p>
    </div>
  )
}

export default QrCode
