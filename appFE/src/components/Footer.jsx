

const Footer = () => {
    function handleClic(){
        window.scrollTo(0, 0)
    }

return(
<button onClick={handleClic} className="btn-back">Top &#8593;</button> 
)
}

export default Footer