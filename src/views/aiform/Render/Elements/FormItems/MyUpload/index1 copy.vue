<template>
   <el-upload
   v-bind="$attrs"
  >
      <template   v-if="$attrs['list-type'] === 'picture-card'">
         
        <el-icon><Plus></Plus></el-icon> 
      </template>
      <template v-else >
        <el-button size="small" type="primary" icon="Upload">{{$attrs.buttonText}}</el-button>

      </template> 
    <template #tip v-if="$attrs.showTip">
      <div class="el-upload__tip">
        只能上传不超过 {{$attrs.fileSize}}{{$attrs.sizeUnit}} 的{{$attrs.accept}}文件
      </div>
    </template>
 
  </el-upload>  
</template>
<script setup name="my-upload">  
import {reactive} from 'vue' 


const props = defineProps({
    
}) 
     
</script>