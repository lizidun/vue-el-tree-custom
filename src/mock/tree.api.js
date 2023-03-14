import axios from 'axios'
import qs from 'qs'

let id = 1000

export let data = [
  // {
  //   "id": 1,
  //   "name": "技术部",
  //   "level": 1,
  //   "child": [
  //     {
  //       "id": 2,
  //       "name": "运维组",
  //       "level": 2,
  //       "child": [
  //         {
  //           "id": 3,
  //           "name": "godo",
  //           "level": 3,
  //           "child": []
  //         }
  //       ]
  //     },
  //     {
  //       "id": 4,
  //       "name": "测试组",
  //       "level": 2,
  //       "child": []
  //     }
  //   ]
  // }
]

export let initDataV1 = (level) => {
  const dataToList = qs.stringify({
  }, { indices: false })
  axios({
    method: 'post',
    url: 'http://81.68.153.95:8520/api/v' + level + '/List',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: dataToList,
  }).then(response => {

    console.log(response.data);

    for (let nIndex = 0; nIndex < response.data.data.length; nIndex++) {
      data.push({ "id": response.data.data[nIndex]["id"], "uuid": response.data.data[nIndex]["uuid"], "name": response.data.data[nIndex]["content"], "level": level, "child": dataTemp });
      };
    console.log(data);
  });
}

export let dataTemp = []

export let initDataV2 = (level) => {
  const dataToList = qs.stringify({
  }, { indices: false })
  axios({
    method: 'post',
    url: 'http://81.68.153.95:8520/api/v' + level + '/List',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: dataToList,
  }).then(response => {
    console.log(response.data);
    for (let nIndex = 0; nIndex < response.data.data.length; nIndex++) {
      dataTemp.push({ "id": response.data.data[nIndex]["id"], "uuid": response.data.data[nIndex]["uuid"], "name": response.data.data[nIndex]["content"], "level": level, "child": [] });
    }
    console.log(dataTemp);

    return dataTemp;
  });
}

initDataV2(2);
initDataV1(1);

export let getServiceTree = () => {
  return {
    "code": 200,
    "message": 'ok',
    "is_superuser": true, //是否管理员，管理员可操作，非管理员看不见操作按钮
    "data": data
  }
}

export let delItem = (data, payload) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === payload.id) {

      const dataToDelete = qs.stringify({
        uuid: data[i].uuid
      }, { indices: false })
      axios({
        method: 'post',
        url: 'http://81.68.153.95:8520/api/v' + data[i].level + '/Delete',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: dataToDelete,
      }).then(response => {
        console.log(response.data);
      }).catch(error => {
        console.log(error);
      });

      data.splice(i, 1)

      break
    }
    if (data[i].child && data[i].child.length) {
      delItem(data[i].child, payload)
    }
  }
}

export let addItem = (data, payload) => {
  let addObj
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === payload.id) {
      addObj = {
        id: id++,
        name: payload.name,
        level: data[i].level + 1,
        child: []
      }
      data[i].child.unshift(addObj)

      const dataToCreate = qs.stringify({
        uuid: "uuid",
        parent_uuid: data[i].uuid,
        content: payload.name,
        create_by: "lizidun"
      }, { indices: false })
      axios({
        method: 'post',
        url: 'http://81.68.153.95:8520/api/v' + (data[i].level + 1) + '/Create',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: dataToCreate,
      }).then(response => {
        console.log(response.data);
      }).catch(error => {
        console.log(error);
      });

      break
    }

    if (data[i].child && data[i].child.length) {
      addItem(data[i].child, payload)
    }
  }
}

export let updateItem = (data, payload) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === payload.id) {
      data[i].name = payload.name
      break
    }

    if (data[i].child && data[i].child.length) {
      updateItem(data[i].child, payload)
    }
  }
}
