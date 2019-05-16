<template>
  <div class="main">
    <mt-header class="header" fixed title="QR Code"></mt-header>
    <div class="qrcode-stream">
      <qrcode-stream @decode="onDecode" @init="onInit"/>
    </div>
    <div class="capture-area">
      <qrcode-capture @decode="onDecode"/>
    </div>
  </div>
</template>

<script>
import { Header } from 'mint-ui';
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from "vue-qrcode-reader";

export default {
  name: "QRcodeReader",
  components: {Header,QrcodeStream, QrcodeDropZone, QrcodeCapture },
  data() {
    return {
      headerTitle: "QRcode Reader",
      result: "",
      error: "",
      dragover: false,
      noStreamApiSupport: false
    };
  },

  methods: {
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        }
        console.error(error);
      }
    },
    onDecode(decodedString) {
      console.log(decodedString);
      this.$router.push({
        name: "QRcodeInfo",
        params: { decodedString: decodedString }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.main{
  display: flex;
  flex-direction: column;
}
.header{
  background-color: #c00000;
}
.qrcode-stream{
  margin-top: 40px;
  padding: 0px;
}
.capture-area {
  margin-top: 5px;
  height: 200px;
  line-height: 200px;
  color:white;
  border-radius: 10px;
  text-align: center;
  font-weight: bold;
  background-color:gray;
}
</style>
