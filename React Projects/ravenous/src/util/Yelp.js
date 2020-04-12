const apiKey = '2p_stbV-RbD0KRW4fkIixY0GCLSEGxKtZlvSlfLdtPv71-ZCrm0NwB0LGyiPKLFYK61sW_LC6akyObdBg3Cmj2Vu4J7etZ99wr9oiyZwqesnm0qr6JWhDDBdMPKSXnYx';

const Yelp = {
    search: function(term,location,sortBy) {
        return fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`,{
            headers: {
                Authorization: `Bearer ${apiKey}`,
                requireHeader: 'origin'
            }
        }).then(response=>{
            return response.json()
        }).then(jsonResponse=>{
            if(jsonResponse.businesses){
                return jsonResponse.businesses.map(business=>{
                   return{ id: business.id,
                    imageSrc: business.image_url,
                    name: business.name,
                    address: business.location.address,
                    city: business.location.city,
                    state: business.location.state,
                    zipCode: business.location.zip_code,
                    category: business.categories.title,
                    rating: business.rating,
                    reviewCount: business.reviewCount}
                })
            }
        });
    }
};

export default Yelp;