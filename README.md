# rotoProducts
A javascript preloader for images which allow rotation around an object via slider control.

Add this anywhere within the body of your website:

``` javascript 
<div id="rotoproduct"
  data-view-1="VIEW_1_IMAGE_FOLDER/"
  data-view-2="VIEW_2_IMAGE_FOLDER/"
><button class='rotoButton'>Change View</button>
</div>
<script src="https://unpkg.com/rotoproducts"></script>
```

`VIEW_1_IMAGE_FOLDER/` should be a relative URL on the same host which contains a folder of 50 photos taken around a product.

At minimum you must add the following css to the page hosting the rotoProduct:

``` css
  #rotoproduct{
      background-color:#fff;
      height: calc(100% * 16 / 9);
      width:100%;
      cursor:ew-resize;
      user-select:none;
      -webkit-user-select:none;
      -khtml-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none
  }

  img{
       pointer-events:none;
       user-select:none
  }
```


The naming scheme for those images should be 5 digits starting from 0, such that the first three are like:

```
00000.jpg
00001.jpg
00003.jpg
etc...
```

The loading bar is designed for 50 photo slices but it can actually be an artibrary number.
