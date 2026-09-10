"""Reproduce conceptual figures and source-labelled OECD/JRC data chart."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
FONT = '/System/Library/Fonts/STHeiti Medium.ttc'
BG, INK, MUTED = '#F4F1EA', '#24231F', '#68675F'
BLUE, ORANGE, GREEN = '#356F96', '#D85427', '#447568'

def canvas(title, subtitle):
    im = Image.new('RGB', (1600, 900), BG)
    d = ImageDraw.Draw(im)
    d.text((75, 65), title, font=ImageFont.truetype(FONT, 49), fill=INK)
    d.text((78, 142), subtitle, font=ImageFont.truetype(FONT, 25), fill=MUTED)
    d.line((75, 205, 1525, 205), fill='#D8D3C8', width=2)
    d.text((75, 842), '物尽其分 · Matter Sorted    /    作者逻辑示意 · 非实测数据', font=ImageFont.truetype(FONT, 22), fill=MUTED)
    return im, d

def box(d, x, y, w, title, lines, color):
    d.rectangle((x,y,x+w,y+250), fill='#ECE8DE')
    d.rectangle((x,y,x+5,y+250), fill=color)
    d.text((x+25,y+25), title, font=ImageFont.truetype(FONT,32), fill=color)
    for i,line in enumerate(lines):
        d.text((x+25,y+92+i*43),line,font=ImageFont.truetype(FONT,25),fill=INK)

def arrow(d, x1, y, x2, color=BLUE):
    d.line((x1,y,x2,y),fill=color,width=4)
    d.polygon(((x2,y),(x2-13,y-9),(x2-13,y+9)),fill=color)

im,d=canvas('先定义原料，再设计分选','需求反推：接收规格决定识别与分离任务')
box(d,75,275,430,'01  下游接收规格',['目标组分与允许杂质','组成波动与供料要求','示例：允许 PE / PP 混合'],BLUE)
box(d,585,275,430,'02  分选目标',['富集什么，剔除什么','分到什么程度才有用','哪些区别无需继续细分'],GREEN)
box(d,1095,275,430,'03  工艺组合',['物理预分选与铺料','视觉 / 光谱按需组合','执行分离与批次验收'],ORANGE)
arrow(d,515,400,570); arrow(d,1025,400,1080)
d.line((1310,550,1310,650,290,650,290,550),fill=GREEN,width=4)
d.polygon(((290,550),(280,567),(300,567)),fill=GREEN)
d.text((480,682),'验收反馈：修正任务、工艺与接收约定',font=ImageFont.truetype(FONT,32),fill=GREEN)
d.text((75,770),'注：PE / PP 混合接收是条件示例，实际要求以具体工艺规格为准。',font=ImageFont.truetype(FONT,24),fill=MUTED)
im.save(ROOT/'fig-02.png')

im,d=canvas('价值按每吨来料计算','相对现有工艺比较；各项采用一致的核算边界')
box(d,75,280,430,'收入差额',['实际被接收的产物量','乘以实际结算价格','新方案收入减基线收入'],GREEN)
box(d,585,280,430,'可避免的处置费用',['确实减少的处理支出','避免重复计入','以实际合同条件为准'],BLUE)
box(d,1095,280,430,'新增全成本',['设备摊销、能耗、人工','维护、耗材与运输','新增残余物处理费用'],ORANGE)
for x,s in [(532,'+'),(1050,'−')]:
    d.text((x,375),s,font=ImageFont.truetype(FONT,46),fill=INK)
d.line((75,615,1525,615),fill='#D8D3C8',width=2)
d.text((75,654),'= 每吨来料的增量收益',font=ImageFont.truetype(FONT,45),fill=INK)
d.text((75,738),'共同约束：验收合格率 · 产物回收率 · 实际吞吐量 · 开机率',font=ImageFont.truetype(FONT,29),fill=MUTED)
im.save(ROOT/'fig-03.png')

im,d=canvas('从“垃圾里有什么”','走向“下游需要什么，以及怎样经济地分出来”')
for x,c,t,desc in [(75,BLUE,'需求','谁接收，按什么规格'),(585,GREEN,'分选','测量、判断与物理分离'),(1095,ORANGE,'价值','合格原料与实际成本')]:
    box(d,x,310,430,t,[desc,'让技术选择回到材料去向'],c)
arrow(d,515,435,570); arrow(d,1025,435,1080)
d.text((75,690),'物理 AI 时代的固废分选',font=ImageFont.truetype(FONT,42),fill=INK)
im.save(ROOT/'cover.jpg',quality=95)

# Independent panels: different years and regions, not a combined flow.
im,d=canvas('收集到，不等于回收了','不同年份与地域分别展示；不能据此直接比较地区绩效')
for x,title in [(75,'全球 · 2019'),(825,'EU-27 · 2022')]:
    d.text((x,255),title,font=ImageFont.truetype(FONT,36),fill=INK)

def bar(x,y,label,value,color):
    d.text((x,y),label,font=ImageFont.truetype(FONT,26),fill=INK)
    d.rectangle((x,y+48,x+500,y+89),fill='#E1DDD3')
    d.rectangle((x,y+48,x+500*value/100,y+89),fill=color)
    d.text((x+525,y+44),f'{value:g}%',font=ImageFont.truetype(FONT,30),fill=color)

bar(75,340,'塑料废物最终回收比例',9,BLUE)
bar(825,340,'塑料废物妥善收集比例',86,GREEN)
bar(825,495,'报废端回收率',19.6,ORANGE)
d.text((75,520),'统计总量：353 Mt 塑料废物',font=ImageFont.truetype(FONT,25),fill=MUTED)
d.text((75,565),'9% 已扣除回收过程损失',font=ImageFont.truetype(FONT,25),fill=MUTED)
d.line((770,260,770,650),fill='#D8D3C8',width=2)
d.text((75,685),'条形标尺：0–100%；数字为报告估算 / 模型结果。',font=ImageFont.truetype(FONT,25),fill=MUTED)
d.text((75,740),'来源：OECD Global Plastics Outlook（2022），第2章；',font=ImageFont.truetype(FONT,23),fill=MUTED)
d.text((75,779),'JRC142860（2025），2022 年 EU-27 塑料物质流分析。链接见正文与参考资料。',font=ImageFont.truetype(FONT,23),fill=MUTED)
d.rectangle((0,831,1600,900),fill=BG)
d.text((75,849),'物尽其分 · Matter Sorted    /    作者据公开数据重绘',font=ImageFont.truetype(FONT,22),fill=MUTED)
im.save(ROOT/'fig-01.png')
