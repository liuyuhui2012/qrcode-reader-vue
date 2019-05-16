<template>
  <div class="info">
    <mt-header class="header" fixed title="QR Code Info">
      <router-link to="/" slot="left">
        <mt-button icon="back">back</mt-button>
      </router-link>
    </mt-header>
    <mt-field class="inputArea" label placeholder type="textarea" rows="6" v-model="decodedString"></mt-field>
    <div id="QRCodeInputTips"></div>
    <div class="infoArea" id="infoArea"></div>
  </div>
</template>

<script>
import { Header, Cell } from "mint-ui";

export default {
  name: "QRcodeInfo",
  components: { Header, Cell },
  data() {
    return {
      headerTitle: "QRcode Info",
      decodedString: "",
      titleSchema: [
        { code: "00", title: "Payload Format Indicator" },
        { code: "01", title: "Point of Initiation Method" },
        { code: "52", title: "Merchant Category Code" },
        { code: "53", title: "Transaction Currency" },
        { code: "54", title: "Transaction Amount" },
        { code: "55", title: "Tip or Convenience Indicator" },
        { code: "56", title: "Value of Convenience Fee Fixed" },
        { code: "57", title: "Value of Convenience Fee Percentage " },
        { code: "58", title: "Country Code " },
        { code: "59", title: "Merchant Name " },
        { code: "60", title: "Merchant City" },
        { code: "61", title: "Postal Code" },
        { code: "62", title: "Additional Data Field Template" },
        { code: "63", title: "CRC" },
        { code: "64", title: "Merchant Information—Language Template" }
      ],
      ID62TitleSchema: [
        { code: "01", title: "Bill Number" },
        { code: "02", title: "Mobile Number" },
        { code: "03", title: "Store Label" },
        { code: "04", title: "Loyalty Number" },
        { code: "05", title: "Reference Label" },
        { code: "06", title: "Customer Label" },
        { code: "07", title: "Terminal Label" },
        { code: "08", title: "Purpose of Transaction" },
        { code: "09", title: "Additional Consumer Data Request" }
      ],
      ID64TitleSchema: [
        { code: "00", title: "Language Preference" },
        { code: "01", title: "Merchant Name—Alternate Language" },
        { code: "02", title: "Merchant City—Alternate Language" }
      ]
    };
  },

  mounted: function() {
    this.decodedString = this.$route.params.decodedString;
    try {
      // analysis data array
      var infoArr = this.analysisInfomation(this.decodedString);
      // create date element and show
      this.showInfoItem(infoArr);
    } catch (e) {
      console.error(e);
      var errorTips=document.getElementById("QRCodeInputTips");
      errorTips.style.marginTop="20px";
      errorTips.innerHTML = "the QRCode Info is not EMV info";
    }
  },

  methods: {
    // analysis data array
    analysisInfomation(str) {
      var resArr = [];
      var rollingNum = 0;
      var totalLength = str.length;
      for (var i = 0; i < 999; i++) {
        var codeStr = str.substring(rollingNum, rollingNum + 2);
        var code = parseInt(codeStr);
        if (!(code >= 0 && code < 100)) {
          throw "code is not number";
        }
        var lengthStr = str.substring(rollingNum + 2, rollingNum + 4);
        var length = parseInt(lengthStr);
        if (!(code >= 0 && code < 100)) {
          throw "length is not number";
        }
        var info = str.substring(rollingNum + 4, rollingNum + 4 + length);
        var infoBean = {
          code: codeStr,
          length: length,
          info: info
        };
        resArr.push(infoBean);
        rollingNum = rollingNum + 4 + length;
        if (rollingNum >= totalLength) {
          break;
        }
      }
      resArr.sort(function(a, b) {
        return parseInt(a.code) - parseInt(b.code);
      });
      return resArr;
    },

    // show Item
    showInfoItem(infoArr) {
      for (var i = 0; i < infoArr.length; i++) {
        var info = infoArr[i];
        if (info.code >= 2 && info.code <= 51) {
          this.showMerchantAccountInformation(info);
        } else if (info.code === "62") {
          this.showAdditionalDataFieldTemplate(info);
        } else if (info.code === "64") {
          this.showLanguageTemplate(info);
        } else if (parseInt(info.code) >= 80 && parseInt(info.code) <= 99) {
          this.showCode80To99(info);
        } else {
          this.showGeneralItem(info);
        }
      }
    },

    // show code "02-51" Merchant Account Information
    showMerchantAccountInformation(info) {
      var infoAreaDiv = document.getElementById("infoArea");
      var itemDiv = document.createElement("div");
      this.setInfoItem(itemDiv);

      var titleDiv = document.createElement("div");
      this.setInfoItemTitle(titleDiv);
      titleDiv.innerHTML = info.code + " - Merchant Account Information";

      itemDiv.appendChild(titleDiv);

      var merchantAccountInfomationArr = this.analysisInfomation(info.info);
      for (var i = 0; i < merchantAccountInfomationArr.length; i++) {
        var childInfo = merchantAccountInfomationArr[i];

        var item2Div = document.createElement("div");
        this.setInfoItem2(item2Div);

        var title2Div = document.createElement("div");
        this.setInfoItemTitle2(title2Div);

        title2Div.innerHTML =
          childInfo.code +
          (childInfo.code === "00"
            ? " - Globally Unique Identifier"
            : " - Acquirer Defined Field");

        var contentDiv = document.createElement("div");
        this.setInfoItemContent2(contentDiv);
        contentDiv.innerHTML = childInfo.info;

        item2Div.appendChild(title2Div);
        item2Div.appendChild(contentDiv);
        itemDiv.appendChild(item2Div);
      }
      infoAreaDiv.appendChild(itemDiv);
    },

    // show code "62" Merchant Account Information
    showAdditionalDataFieldTemplate(info) {
      var infoAreaDiv = document.getElementById("infoArea");
      var itemDiv = document.createElement("div");
      this.setInfoItem(itemDiv);

      var titleDiv = document.createElement("div");
      this.setInfoItemTitle(titleDiv);
      titleDiv.innerHTML = info.code + " - Additional Data Field Template";
      itemDiv.appendChild(titleDiv);

      var additionalDataFieldTemplateArr = this.analysisInfomation(info.info);
      for (var i = 0; i < additionalDataFieldTemplateArr.length; i++) {
        var childInfo = additionalDataFieldTemplateArr[i];

        var item2Div = document.createElement("div");
        this.setInfoItem2(item2Div);

        var title2Div = document.createElement("div");
        this.setInfoItemTitle2(title2Div);

        var title2Str = "";
        if (parseInt(childInfo.code) > 0 && parseInt(childInfo.code) < 10) {
          for (var j = 0; j < this.ID62TitleSchema.length; j++) {
            if (this.ID62TitleSchema[j].code === childInfo.code) {
              title2Str = this.ID62TitleSchema[j].title;
              break;
            }
          }
        } else if (parseInt(childInfo.code) <= 49) {
          title2Str = "RFU for EMVCo";
        } else {
          title2Str = "Payment System specific templates.";
        }
        title2Div.innerHTML = childInfo.code + " - " + title2Str;

        var contentDiv = document.createElement("div");
        this.setInfoItemContent2(contentDiv);
        contentDiv.innerHTML = childInfo.info;

        item2Div.appendChild(title2Div);
        item2Div.appendChild(contentDiv);
        itemDiv.appendChild(item2Div);
      }
      infoAreaDiv.appendChild(itemDiv);
    },

    // code "64" Language Template
    showLanguageTemplate(info) {
      var infoAreaDiv = document.getElementById("infoArea");
      var itemDiv = document.createElement("div");
      this.setInfoItem(itemDiv);

      var titleDiv = document.createElement("div");
      this.setInfoItemTitle(titleDiv);
      titleDiv.innerHTML =
        info.code + " -  Merchant Information — Language Template";
      itemDiv.appendChild(titleDiv);

      var languageTemplateFieldTemplateArr = this.analysisInfomation(info.info);
      for (var i = 0; i < languageTemplateFieldTemplateArr.length; i++) {
        var childInfo = languageTemplateFieldTemplateArr[i];

        var item2Div = document.createElement("div");
        this.setInfoItem2(item2Div);

        var title2Div = document.createElement("div");
        this.setInfoItemTitle2(title2Div);
        var title2Str = "";
        if (parseInt(childInfo.code) >= 0 && parseInt(childInfo.code) < 3) {
          for (var j = 0; j < this.ID64TitleSchema.length; j++) {
            if (this.ID64TitleSchema[j].code === childInfo.code) {
              title2Str = this.ID64TitleSchema[j].title;
              break;
            }
          }
        } else {
          title2Str = "RFU for EMVCo";
        }
        title2Div.innerHTML = childInfo.code + " - " + title2Str;

        var contentDiv = document.createElement("div");
        this.setInfoItemContent2(contentDiv);
        contentDiv.innerHTML = childInfo.info;

        item2Div.appendChild(title2Div);
        item2Div.appendChild(contentDiv);
        itemDiv.appendChild(item2Div);
      }
      infoAreaDiv.appendChild(itemDiv);
    },

    // show code 80 -99
    showCode80To99(info) {
      var infoAreaDiv = document.getElementById("infoArea");
      var itemDiv = document.createElement("div");
      this.setInfoItem(itemDiv);

      var titleDiv = document.createElement("div");
      this.setInfoItemTitle(titleDiv);
      titleDiv.innerHTML = info.code + " - Unreserved Templates";

      itemDiv.appendChild(titleDiv);

      var unreservedTemplatesInfomationArr = this.analysisInfomation(info.info);
      for (var i = 0; i < unreservedTemplatesInfomationArr.length; i++) {
        var childInfo = unreservedTemplatesInfomationArr[i];

        var item2Div = document.createElement("div");
        this.setInfoItem2(item2Div);

        var title2Div = document.createElement("div");
        this.setInfoItemTitle2(title2Div);

        title2Div.innerHTML =
          childInfo.code +
          (childInfo.code === "00"
            ? " - Globally Unique Identifier"
            : " - Context Specific Data");

        var contentDiv = document.createElement("div");
        this.setInfoItemContent2(contentDiv);
        contentDiv.innerHTML = childInfo.info;

        item2Div.appendChild(title2Div);
        item2Div.appendChild(contentDiv);
        itemDiv.appendChild(item2Div);
      }
      infoAreaDiv.appendChild(itemDiv);
    },
    // show the general item
    showGeneralItem(info) {
      var infoAreaDiv = document.getElementById("infoArea");
      var itemDiv = document.createElement("div");
      this.setInfoItem(itemDiv);

      var titleDiv = document.createElement("div");
      this.setInfoItemTitle(titleDiv);
      var titleStr = "";
      for (var j = 0; j < this.titleSchema.length; j++) {
        if (this.titleSchema[j].code === info.code) {
          titleStr = this.titleSchema[j].title;
          break;
        }
      }
      if (titleStr === "") {
        if (parseInt(info.code) >= 65 && parseInt(info.code) <= 79) {
          titleStr = "RFU for EMVCo";
        } else if (parseInt(info.code) >= 90 && parseInt(info.code) <= 99) {
          titleStr = "Unreserved Templates";
        }
      }
      titleDiv.innerHTML = info.code + " - " + titleStr;

      var contentDiv = document.createElement("div");
      this.setInfoItemContent(contentDiv);
      contentDiv.innerHTML = info.info;

      itemDiv.appendChild(titleDiv);
      itemDiv.appendChild(contentDiv);
      infoAreaDiv.appendChild(itemDiv);
    },

    setInfoItem(widget) {
      widget.style.borderTopStyle = "solid";
      widget.style.borderWidth = "1px";
      widget.style.borderColor = "gray";
      widget.style.paddingTop = "8px";
      widget.style.paddingBottom = "8px";
    },

    setInfoItem2(widget) {
      widget.style.borderTop = "1px dotted #555";
      widget.style.margin = "10px";
      widget.style.paddingTop = "8px";
      widget.style.paddingBottom = "8px";
    },

    setInfoItemTitle(widget) {
      widget.style.paddingLeft = "5px";
      widget.style.paddingTop = "10px";
      widget.style.fontSize = "18px";
      widget.style.fontWeight = "bold";
    },

    setInfoItemContent(widget) {
      widget.style.padding = "10px";
      widget.style.fontSize = "16px";
    },

    setInfoItemTitle2(widget) {
      widget.style.paddingTop = "10px";
      widget.style.fontSize = "16px";
      widget.style.fontWeight = "bold";
    },

    setInfoItemContent2(widget) {
      widget.style.paddingTop = "10px";
      widget.style.paddingLeft = "10px";
      widget.style.fontSize = "14px";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.info {
  display: flex;
  flex-direction: column;
}
.header{
  background-color: #c00000;
}
.inputArea {
  margin-top: 40px;
  border-width: 1px;
  border-radius: 10px;
  border-style: solid;
  border-color: gray;
}
.infoArea {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  text-align: left;
}
.QRcodetext {
  font-size: 14px;
}
</style>
