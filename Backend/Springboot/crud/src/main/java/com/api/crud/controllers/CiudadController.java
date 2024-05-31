package com.api.crud.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.crud.DTO.Request.CiudadRequest;
import com.api.crud.models.CiudadModel;
import com.api.crud.services.CiudadService;
import com.api.crud.services.ManejarFechas;

@RestController
@RequestMapping("")
public class CiudadController {
    @Autowired
    private CiudadService ciudadService;

    @CrossOrigin(origins = "http://localhost:5173/")
    @GetMapping("/obtenerCiudades")
    public Map<String, Object> obenerCiudades() {
        return Map.of("data", ciudadService.obtenerCiudades(true), "msg", "Ciudades");
    }

    @CrossOrigin(origins = "http://localhost:5173/")
    @PostMapping("/crearCiudad")
    public Map<String, Object> crearCiudad(@RequestBody CiudadRequest ciudad) {
        CiudadModel ciudadNueva = new CiudadModel();
        ciudadNueva.setFecha_creacion(ManejarFechas.obtenerFechaActual());
        ciudadNueva.setLatitud(ciudad.getLatitud());
        ciudadNueva.setLongitud(ciudad.getLongitud());
        ciudadNueva.setNombre(ciudad.getNombre());
        ciudadNueva.setActivo(true);
        return Map.of("data", ciudadService.guardarCiudad(ciudadNueva), "msg", "Ciudad creada");
    }

    @CrossOrigin(origins = "http://localhost:5173/")
    @PostMapping("/modificarCiudad")
    public Map<String, Object> modificarCiudad(@RequestBody CiudadRequest ciudadModificar) {
        CiudadModel ciudad  = ciudadService.buscarCiudad(ciudadModificar.getId()).get();
        ciudad.setLatitud(ciudadModificar.getLatitud());
        ciudad.setLongitud(ciudadModificar.getLongitud());
        ciudad.setNombre(ciudadModificar.getNombre());
        ciudadService.guardarCiudad(ciudad);
        return Map.of("data", Map.of("estado",true), "msg", "Ciudad creada");
    }
}
