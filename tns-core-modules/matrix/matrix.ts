import {
    TransformFunctionsInfo,
    Pair,
} from "../ui/animation/animation";

import { radiansToDegrees, degreesToRadians } from "../utils/number-utils";

export const getTransformMatrix = ({property, value}) =>
    TRANSFORM_MATRIXES[property](value);

const TRANSFORM_MATRIXES = {
    "scale": ({x, y}) => [
        x, 0, 0,
        0, y, 0,
        0, 0, 1,
    ],
    "translate": ({x, y}) => [
        1, 0, x,
        0, 1, y,
        0, 0, 1,
    ],
    "rotate": angleInDeg => {
        const angleInRad = degreesToRadians(angleInDeg);

        return [
            Math.cos(angleInRad), -Math.sin(angleInRad), 0,
            Math.sin(angleInRad), Math.cos(angleInRad), 0,
            0, 0, 1,
        ]
    },
};

export const matrixArrayToCssMatrix = (m: number[]) => [
    m[0], m[3], m[1],
    m[4], m[2], m[5],
];

export function multiplyNDimensionalMatriceArrays(
    n: number, m1: number[], m2: number[]): number[] {

    let result = [];

    for (let i = 0; i < n; i += 1) {
        for (let j = 0; j < n; j += 1) {
            let sum = 0;
            for (let k = 0; k < n; k += 1) {
                sum += m1[i * n + k] * m2[k * n + j];
            }
            result[i * n + j] = sum;
        }
    }

    return result;
}

export function decompose2DTransformMatrix(matrix: number[])
    : TransformFunctionsInfo {

    verifyTransformMatrix(matrix);

    const [A, B, C, D, E, F] = [...matrix];
    const determinant = A * D - B * C;
    const translate = { x: E || 0, y: F || 0 };

    // rewrite with obj desctructuring using the identity matrix
    let rotate = 0;
    let scale = { x: 1, y: 1 };
    if (A || B) {
        const R = Math.sqrt(A*A + B*B);
        rotate = B > 0 ? Math.acos(A / R) : -Math.acos(A / R);
        scale = { x: R, y: determinant / R };
    } else if (C || D) {
        const R = Math.sqrt(C*C + D*D);
        rotate = Math.PI / 2 - (D > 0 ? Math.acos(-C / R) : -Math.acos(C / R));
        scale = { x: determinant / R, y: R  };
    }

    rotate = radiansToDegrees(rotate);

    return { translate, rotate, scale };
}

function verifyTransformMatrix(matrix: number[]) {
    if (matrix.length < 6) {
        throw new Error("Transform matrix should be 2x3.");
    }
}
