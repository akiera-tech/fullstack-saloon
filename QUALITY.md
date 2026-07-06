# QUALITY

This project was built by Akie and verified before delivery.

What ran at build time:
- Build verification: the project compiled; failures trigger a bounded
  fix loop before anything is delivered.
- Runtime doctor: the live page was loaded and read back; runtime errors
  trigger the same bounded fix loop.
- The Akie Code Standard (code hygiene): clean on the first pass. Rules: no
  leftover console.log/debugger, no lorem ipsum, no TODO/FIXME/HACK,
  no untyped `any` sprawl, every image has alt text, no dead links.

Re-verify anytime, on any machine:

    npm run akie:check

The checker ships with this project (zero dependencies) and runs the
same Standard rules locally. It exits nonzero on findings, so it drops
straight into CI.
