// 所有的导航菜单
const allMenus = [{
    displayName: '栏目',
    key: 'column',
    subMenu: [{
        displayName: '栏目列表',
        key: 'column_list'
    }]
},
{
    displayName: '栏目内容',
    key: 'columnContent',
    subMenu: [{
        displayName: '栏目内容列表',
        key: 'columnContent_list'
    },
    {
        displayName: '栏目内容编辑页',
        key: 'columnContent_update'
    }
    ]
}
]

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
}
