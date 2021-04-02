function get(imageName, imageUrl) {
	let img_url = uni.getStorageSync(imageName)
	console.log(img_url)
	if (img_url) {
		return img_url
	} else {
		download(imageName, imageUrl)
		return imageUrl
	}
}

function remove(imageName) {
	if (imageName !== undefined) {
		uni.removeStorageSync(imageName)
	}
	
}

async function download(imageName, imageUrl) {
	uni.downloadFile({
	    url: imageUrl,
	    success: (ress) => {
	        if (ress.statusCode === 200) {
	            uni.setStorage({
	                key: imageName,
	                data:ress.tempFilePath,
	                success:function(){
	                    
	                }
	            })
				try {
					uni.saveFile({
						tempFilePath: ress.tempFilePath,
						success: function(res) {
							uni.setStorage({
							    key: imageName,
							    data: res.savedFilePath,
							    success:function(){
							        
							    }
							})
						}
					});
				} catch (e) {
				}
	        }else{
	        }
	    },
	    fail:()=>{
	    }
	});
}

module.exports = {
    get: get,
	remove: remove
}