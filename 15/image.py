from dataclasses import dataclass
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import matplotlib as mpl

FILENAME = 'input.txt'
# FILENAME = 'input_demo.txt'


@dataclass
class Point:
    x: int
    y: int


def distance(p1: Point, p2: Point) -> int:
    return abs(p1.x - p2.x) + abs(p1.y - p2.y)


@dataclass
class Row:
    sensor: Point
    beacon: Point

    def distance(self) -> int:
        return distance(self.sensor, self.beacon)

    def offset(self) -> int:
        r = self.beacon.y - self.sensor.y
        c = self.beacon.x - self.sensor.x
        return abs(c) + abs(r)


data: list[Row] = []

with open(f'./15/{FILENAME}', 'r') as f:
    # with open('./15/input_demo.txt', 'r') as f:
    lines = f.readlines()
    for l in lines:
        words = l.split()
        print(words[8], words[9])
        data.append(Row(
            sensor=Point(int(words[2][2:-1]), int(words[3][2:-1])),
            beacon=Point(int(words[8][2:-1]), int(words[9][2:])),
        ))


fig = plt.figure()
ax = fig.add_subplot(111)
# trans = mpl.transforms.Affine2D().rotate_deg(45) + ax.transData

limit = 20 if FILENAME == 'input_demo.txt' else 4_000_000

ax.add_line(mpl.lines.Line2D(
    [0, 0], [0, limit], color="orange", linewidth=1
))
ax.add_line(mpl.lines.Line2D(
    [0, limit], [limit, limit], color="orange", linewidth=1
))
ax.add_line(mpl.lines.Line2D(
    [limit, limit], [limit, 0], color="orange", linewidth=1
))
ax.add_line(mpl.lines.Line2D(
    [limit, 0], [0, 0], color="orange", linewidth=1
))

# ax.plot(14, 11, 'go')

for row in data:
    o = row.offset()

    print(row, o, row.sensor.y - o)

    ax.plot(row.sensor.x, row.sensor.y, 'ro')
    ax.plot(row.beacon.x, row.beacon.y, 'bo')

    path = patches.Polygon(
        np.array([
            [row.sensor.x, row.sensor.y - o],
            [row.sensor.x + o, row.sensor.y],
            [row.sensor.x, row.sensor.y + o],
            [row.sensor.x - o, row.sensor.y]]), closed=True, color='blue', alpha=0.2)
    # path.set_transform(trans)

    ax.add_patch(path)


# r2 = patches.Rectangle((0, 0), 20, 40, color="red",  alpha=0.50)

# r2.set_transform(t2)

# ax.add_patch(r1)
# ax.add_patch(r2)

ax.plot(2572895, 2906626, 'ys')

for acc in [[0, 1], [1, 0], [0, -1], [-1, 0]]:
    x, y = acc
    ax.plot(2572895 + x, 2906626 + y, 'go')

plt.xlim(-5, limit + 5)
plt.ylim(-5, limit + 5)

plt.grid(True)

# ax.invert_xaxis()
ax.invert_yaxis()

plt.show()
