//这部分由于小程序官方的更新，已经没啥用了

/**
 * promise 形式的 getSetting
 */
export const getSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
          
    })
}

/**
 * promise 形式的 chooseAddress
 */
export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
          
    })
}

/**
 * promise 形式的 openSetting
 */
export const openSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.openSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
          
    })
}

// 这里开始有用了！！

/**
 * promise 形式的 showModal
 * @param {object} param0 参数
 */
export const showModal=({content})=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title: '提示',
            content: content,
            success: (result) => {
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            }
          })
    })
}

/**
 * promise 形式的 showToast
 * @param {object} param0 参数
 */
export const showToast=({title})=>{
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title: title,
            icon: 'none',
            success: (result) => {
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            }
        });
          
    })
}