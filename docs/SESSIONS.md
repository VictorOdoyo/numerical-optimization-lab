# Sessions and exports

Version-1 sessions contain problem, method, start, seed, lambda, loss and options. Imports are limited to 64 KiB and reject unknown keys, incompatible methods, nonfinite options, invalid dimensions and unsupported versions. Problem functions are selected by catalog ID; JSON cannot execute code.

Advanced imported parameters are retained when running and resaving through the console. Changing methods clears those extras. Custom programmatic problems remain library-only and are not serialized as executable callbacks.

Result JSON includes final coordinates, a summary and full trace. Nonfinite report values become null. CSV includes coordinates for every iterate. A convergence plot may clip gaps at 1e-16; exported objective values preserve their original precision. Plot samples and diagnostics use separate accounting from solver callbacks.
