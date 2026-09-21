convert -size 1000x1000 xc:white \
  -stroke '#50452d' -strokewidth 16 -fill none \
  -draw "bezier 225,215 150,340 130,460 210,550" \
  -draw "bezier 210,550 260,600 340,600 380,550" \
  -draw "bezier 380,550 440,460 380,340 225,215" \
  -draw "bezier 330,580 320,500 340,440 370,380" \
  -draw "bezier 330,480 270,470 230,420 220,380" \
  -draw "bezier 220,380 250,360 300,390 330,440" \
  -draw "bezier 350,420 370,330 420,280 460,260" \
  -draw "bezier 460,260 470,310 440,380 370,410" \
  -stroke none -fill '#50452d' \
  -font KacstTitle -pointsize 110 -draw "text 480,450 'استنبات'" \
  -font Liberation-Sans-Bold -pointsize 54 -draw "text 490,540 'I S T E N B A T'" \
  public/assets/Artisanal_brand_logo_design_20260921173215.jpeg

cp public/assets/Artisanal_brand_logo_design_20260921173215.jpeg public/assets/Artisanal_brand_logo_design_202609211732.png
cp public/assets/Artisanal_brand_logo_design_20260921173215.jpeg public/assets/Artisanal_brand_logo_design_20260921.png
echo "Logo created successfully!"
ls -lh public/assets/Artisanal*
