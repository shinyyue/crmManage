// 所有的导航菜单
const allMenus = [{
    displayName: '患者管理',
    key: 'patient',
    subMenu: [{
        displayName: '患者列表',
        key: 'patient_list'
    }]
},
{
    displayName: '医学顾问模块',
    key: 'im',
    subMenu: [{
        displayName: '医学顾问会话',
        key: 'im_index'
    },
    {
        displayName: '医学顾问快捷回复管理',
        key: 'im_manage'
    }
    ]
}
]
// const formatCycleType = cId => {//     // switch(cId) {//     //     case: 10//     //         return ''//     // }// }

// 检验是否具有某个操作权限
const checkAuthKey = key => {
    const authlist = localStorage.getItem('authList')
    if (authlist && authlist !== 'undefined') {
        return authlist.findIndex(key) !== -1
    }
    return false
}
export default {
    allMenus,
    checkAuthKey
    // formatCycleType
}
