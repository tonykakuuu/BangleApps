(function() {

  var datestring = "";
  var date = new Date();
  var wkday = "";
  var year = "";
  var month = "";
  var day = "";

  const jpchars = [
    "\u0000\t\u000f\u0000ÿÀ`0\u0018\f\u0007ÿ\u0001À`0\u0018\u000fþ\u0002",
    "\u0000\f\u0010\u0000\u001fñ\u0001\u0010\u0011\u0001\u0010\u0011ÿ\u0010\u0011\u0001\u0010\u0011ÿ\u0010\u0011\u0001 \u0012\u0001@X\u0002",
    "\u0000\u000f\u0010\u0000\u0001\u0000\u0002\u0000\u0004\u0000A\u0010\"\bH\u0010B\u0005\u0000\u0011\u0000\"\u0000\u0002\u0002\b\u0002`\u0003",
    "\u0000\u000f\u0010\u0000\u0001\u0000\u0002\u0000\u0004\u0000\b@\u0010²\u0001h\u0004 \t@\"@DA\bD\u0010p \u0001@\u0001\u0000",
    "\u0000\u000f\u0010\u0000\u0001\u0000\u0002\u0000\u0004\u0000\b\u0007ÿÀp\u0001P\u0002 \t \" \"\b(\u0010  \u0000@\u0000",
    "\u0000\u000f\u000f\u0000\u0001\u0000\u0002\u0000\n\u0000\"\u0000\u0002\u0002\u000bú`\u0001\u0000ð\u0004\u0000\u0001$?ÿ",
    "\u0000\u000f\u000f\u0000\u0001\u0000\u0002\u0000\u0004\u0000\b\u0000\u0010\u0000 \u000fþ\u0000\u0001\u0000\u0002\u0000\u0004\u0000\b\u0000\u0010\u0000 ?ÿ",
    "\u0000\u000f\u0010\u0000\u0010\u0000 \u0000ñ\u0004\u0002\b\b\u0010\u0007þ\b@\u0010!\u0003ÿø\u0004\u0000\b\u0000\u0010\u0000 \u0000@"
  ];
  
  for (let i=0; i < 7; i++)
    {
      if (require("locale").dow(date,0) == require("date_utils").dow(i)  ) {
        wkday = jpchars[i];
      }
    }

  month = date.getMonth(date)+1;
  year = date.getFullYear(date);
  day = date.getDate(date);
  dow = date.getDay(date);

  return {
    name: "Bangle",
    items: [
      { name : "JP",
        get : () => {
          return {
            text : datestring,
            img : atob("")
          };
        },
        show : function() {},
        hide : function() {}
      }
    ]
  };
});
