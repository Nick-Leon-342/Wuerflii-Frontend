

const upperTable = {
    1: [ 0, 1, 2, 3, 4, 50 ],
    2: [ 0, 2, 4, 6, 8, 50 ],
    3: [ 0, 3, 6, 9, 12, 50 ],
    4: [ 0, 4, 8, 12, 16, 50 ],
    5: [ 0, 5, 10, 15, 20, 50 ],
    6: [ 0, 6, 12, 18, 24, 50 ],
}

const bottomTable = {
    0: [ 0,  ], //Dreierpasch
    0: [ 0,  ], //Viererpasch
    0: [ 0, 25, 50 ], //Full-House
    0: [ 0, 30, 40, 50 ], //Kleine Straße
    0: [ 0, 40, 50  ], //Große Straße
    0: [ 0, 50  ], //Kniffel
    0: [ 6, 7, 8, 9, 10 ], //Chance
}
