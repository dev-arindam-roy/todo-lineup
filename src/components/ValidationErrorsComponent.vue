<template>
    <div v-if="validationErrorListArr.length > 0" class="col-12 alert alert-danger alert-dismissible fade show" role="alert" :data-count="validationErrorListArr.length">
        <div v-for="(error,index) in validationErrorListArr" :key="index">
            <li>{{error}}</li>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
</template>

<script>
export default {
  props:{
    validationErrorListArr: {
      type: Array,
      default:()=>[]
    }
  }
}
</script>